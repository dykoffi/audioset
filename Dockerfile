FROM dykoffi/node-serve:light as release

WORKDIR /App
COPY dist ./

EXPOSE 8000

CMD serve -sp 8000