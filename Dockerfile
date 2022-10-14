FROM dykoffi/node-serve:light as release

WORKDIR /App
COPY build ./

EXPOSE 8000

CMD serve -sp 8000