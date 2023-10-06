FROM postgres:15

RUN apt-get update

ENV build_deps ca-certificates \
	git \
	build-essential \
	libpq-dev \
	postgresql-server-dev-15

RUN apt-get install -y --no-install-recommends $build_deps

RUN mkdir -p /tmp/build
RUN cd /tmp/build \
	&& git clone https://github.com/theory/pgtap \
	&& cd pgtap \
	&& git checkout tags/v1.2.0 \
	&& make install

RUN cd /tmp/build \
	&& git clone https://github.com/iCyberon/pg_hashids \
	&& cd pg_hashids \
	&& make \
	&& make install

RUN apt-get install -y --no-install-recommends libicu-dev \
	&& cd /tmp/build \
	&& git clone https://github.com/okbob/plpgsql_check \
	&& cd plpgsql_check \
	&& git checkout tags/v2.1.2 \
	&& make clean \
	&& make install

RUN cd /tmp/build \
	&& git clone https://github.com/citusdata/pg_cron \
	&& cd pg_cron \
	&& make \
	&& make install

RUN rm -fr /tmp/build \
	&& apt-get clean \
	&& apt-get autoremove -y libicu-dev $build_deps
