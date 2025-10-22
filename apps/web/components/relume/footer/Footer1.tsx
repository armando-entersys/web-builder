type Link = {
  title: string;
  url: string;
};

type LinkColumn = {
  title: string;
  links: Link[];
};

type SocialLink = {
  href: string;
  icon: React.ReactNode;
};

type Props = {
  logo: {
    url: string;
    src: string;
    alt?: string;
  };
  linkColumns: LinkColumn[];
  socialLinks: SocialLink[];
  footerText: string;
  footerLinks: Link[];
};

export const Footer1 = (props: Props) => {
  const { logo, linkColumns, socialLinks, footerText, footerLinks } = props;

  return (
    <footer className="px-[5%] py-12 md:py-18 lg:py-20">
      <div className="container">
        <div className="grid grid-cols-1 gap-x-[4vw] gap-y-12 pb-12 md:gap-y-16 md:pb-18 lg:grid-cols-[0.75fr_1fr] lg:gap-y-4 lg:pb-20">
          <div>
            <a href={logo.url} className="mb-6 inline-block">
              <img src={logo.src} alt={logo.alt} className="h-8 md:h-10" />
            </a>
            <div className="flex gap-3">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="flex size-8 items-center justify-center rounded-full border border-border transition-colors hover:bg-accent"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 md:gap-x-8">
            {linkColumns.map((column, index) => (
              <div key={index}>
                <h3 className="mb-3 font-semibold md:mb-4">{column.title}</h3>
                <ul className="space-y-3">
                  {column.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href={link.url}
                        className="text-sm hover:underline"
                      >
                        {link.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col-reverse items-center justify-between border-t border-border pt-6 text-sm md:flex-row md:pt-8">
          <p>{footerText}</p>
          <ul className="mb-4 flex gap-x-6 md:mb-0">
            {footerLinks.map((link, index) => (
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

Footer1.defaultProps = {
  logo: {
    url: "/",
    src: "https://via.placeholder.com/150x50",
    alt: "Logo",
  },
  linkColumns: [
    {
      title: "Producto",
      links: [
        { title: "Características", url: "#" },
        { title: "Precios", url: "#" },
        { title: "Seguridad", url: "#" },
      ],
    },
    {
      title: "Empresa",
      links: [
        { title: "Nosotros", url: "#" },
        { title: "Blog", url: "#" },
        { title: "Carreras", url: "#" },
      ],
    },
    {
      title: "Recursos",
      links: [
        { title: "Ayuda", url: "#" },
        { title: "Contacto", url: "#" },
        { title: "Documentación", url: "#" },
      ],
    },
  ],
  socialLinks: [
    { href: "#", icon: <span>F</span> },
    { href: "#", icon: <span>T</span> },
    { href: "#", icon: <span>In</span> },
  ],
  footerText: "© 2025 Empresa. Todos los derechos reservados.",
  footerLinks: [
    { title: "Privacidad", url: "#" },
    { title: "Términos", url: "#" },
    { title: "Cookies", url: "#" },
  ],
};
