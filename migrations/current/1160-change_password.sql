/*
 * To change your password you must specify your previous password. The form in
 * the web UI may confirm that the new password was typed correctly by making
 * the user type it twice, but that isn't necessary in the API.
 */

create function app_public.change_password(new_password text, old_password text default null) returns boolean as $$
declare
  v_user app_public.users;
  v_user_secret app_private.user_secrets;
begin
  select users.* into v_user
  from app_public.users
  where id = app_public.current_user_id();

  if v_user is null then
    raise exception 'You must log in to change your password' using errcode = 'LOGIN';
  end if;

  -- Load their secrets
  select * into v_user_secret from app_private.user_secrets
  where user_secrets.user_id = v_user.id;

  if v_user_secret.password_hash != null and v_user_secret.password_hash != crypt(old_password, v_user_secret.password_hash) then
    raise exception 'Incorrect password' using errcode = 'CREDS';
  end if;

  perform app_private.assert_valid_password(new_password);

  -- Reset the password as requested
  update app_private.user_secrets
  set
    password_hash = crypt(new_password, gen_salt('bf'))
  where user_secrets.user_id = v_user.id;

  -- Revoke all other sessions
  delete from app_private.sessions
  where sessions.user_id = v_user.id
  and sessions.uuid <> app_public.current_session_id();

  -- Notify user their password was changed=================
  perform graphile_worker.add_job(
    'user__audit',
    json_build_object(
      'type', 'change_password',
      'user_id', v_user.id,
      'current_user_id', app_public.current_user_id()
    ));
  return true;
end;
$$ language plpgsql strict volatile security definer set search_path to pg_catalog, public, pg_temp;

comment on function app_public.change_password(old_password text, new_password text) is
  E'Enter your old password and a new password to change your password.';

grant execute on function app_public.change_password(text, text) to :DATABASE_VISITOR;
