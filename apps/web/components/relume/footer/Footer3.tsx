import { Button } from "@relume_io/relume-ui";

type Link = {
  title: string;
  url: string;
};

type Props = {
  logo: {
    url: string;
    src: string;
    alt?: string;
  };
  description: string;
  newsletterHeading: string;
  newsletterDescription: string;
  inputPlaceholder: string;
  button: {
    title: string;
  };
  links: Link[];
  footerText: string;
};

export const Footer3 = (props: Props) => {
  const {
    logo,
    description,
    newsletterHeading,
    newsletterDescription,
    inputPlaceholder,
    button,
    links,
    footerText,
  } = props;

  return (
    <footer className="px-[5%] py-12 md:py-18 lg:py-20">
      <div className="container">
        <div className="grid grid-cols-1 gap-x-[8vw] gap-y-12 pb-12 md:pb-18 lg:grid-cols-2 lg:gap-y-4 lg:pb-20">
          <div>
            <a href={logo.url} className="mb-6 inline-block">
              <img src={logo.src} alt={logo.alt} className="h-8 md:h-10" />
            </a>
            <p className="text-sm">{description}</p>
          </div>
          <div>
            <h3 className="mb-3 text-2xl font-bold md:mb-4 md:text-3xl lg:text-4xl">
              {newsletterHeading}
            </h3>
            <p className="mb-6 text-sm md:mb-8">{newsletterDescription}</p>
            <div className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder={inputPlaceholder}
                className="flex-1 rounded-md border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <Button variant="primary">{button.title}</Button>
            </div>
          </div>
        </div>
        <div className="flex flex-col-reverse items-center justify-between border-t border-border pt-6 text-sm md:flex-row md:pt-8">
          <p>{footerText}</p>
          <ul className="mb-4 flex gap-x-6 md:mb-0">
            {links.map((link, index) => (
              <li key={index}>
                <a href={link.url} className="hover:underline">
                  {link.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};

Footer3.defaultProps = {
  logo: {
    url: "/",
    src: "https://via.placeholder.com/150x50",
    alt: "Logo",
  },
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  newsletterHeading: "Suscríbete a nuestro newsletter",
  newsletterDescription: "Recibe las últimas noticias y actualizaciones.",
  inputPlaceholder: "Ingresa tu email",
  button: {
    title: "Suscribirse",
  },
  links: [
    { title: "Privacidad", url: "#" },
    { title: "Términos", url: "#" },
    { title: "Cookies", url: "#" },
  ],
  footerText: "© 2025 Empresa. Todos los derechos reservados.",
};
