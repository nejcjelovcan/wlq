import page from "page";

// We allow void type which is used to define "no params"
type IParams = {
  [param: string]: string;
} | void;

export const router = {
  initialize(routes: { [url: string]: (params: IParams) => void }) {
    Object.keys(routes).forEach(url => {
      page(url, ({ params }) => routes[url](params));
    });
    page.start();
  },
  open: (url: string) => page.show(url)
};
