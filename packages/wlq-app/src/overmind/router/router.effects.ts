import page from "page";
import queryString from "query-string";

// We allow void type which is used to define "no params"
export type PageParams = {
  [param: string]: string;
};

export const router = {
  initialize(routes: { [url: string]: (params: PageParams) => void }) {
    Object.keys(routes).forEach(url => {
      page(url, ({ params, querystring }) => {
        const payload = Object.assign(
          {},
          params,
          queryString.parse(querystring)
        );

        routes[url](payload);
      });
    });
    page.start();
  },
  open: (path: string) => page.show(path)
};
