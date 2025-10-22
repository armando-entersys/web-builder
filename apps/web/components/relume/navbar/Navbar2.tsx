import { Button } from "@relume_io/relume-ui";

type NavLink = {
  title: string;
  url: string;
  subLinks?: Array<{
    title: string;
    url: string;
    description?: string;
  }>;
};

type Props = {
  logo: {
    url: string;
    src: string;
    alt?: string;
  };
  navLinks: NavLink[];
  buttons: Array<{
    title: string;
    variant?: "primary" | "secondary";
  }>;
};

export const Navbar2 = (props: Props) => {
  const { logo, navLinks, buttons } = props;

  return (
    <nav className="flex w-full items-center border-b px-[5%] py-4 md:py-6">
      <div className="flex w-full items-center justify-between">
        <a href={logo.url} className="mr-8">
          <img src={logo.src} alt={logo.alt} className="h-8 md:h-10" />
        </a>

        <div className="hidden flex-1 items-center gap-8 lg:flex">
          {navLinks.map((link, index) => (
            <div key={index} className="relative group">
              <a
                href={link.url}
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                {link.title}
              </a>
              {link.subLinks && link.subLinks.length > 0 && (
                <div className="absolute left-0 top-full hidden w-64 bg-background border rounded-md shadow-lg p-4 group-hover:block">
                  {link.subLinks.map((subLink, subIndex) => (
                    <a
                      key={subIndex}
                      href={subLink.url}
                      className="block px-4 py-2 hover:bg-accent rounded-md"
                    >
                      <div className="font-medium">{subLink.title}</div>
                      {subLink.description && (
                        <div className="text-xs text-muted-foreground">
                          {subLink.description}
                        </div>
                      )}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {buttons.map((button, index) => (
            <Button key={index} variant={button.variant || "primary"}>
              {button.title}
            </Button>
          ))}
        </div>
      </div>
    </nav>
  );
};

Navbar2.defaultProps = {
  logo: {
    url: "/",
    src: "https://via.placeholder.com/150x50",
    alt: "Logo"
  },
  navLinks: [
    { title: "Inicio", url: "/" },
    {
      title: "Servicios",
      url: "/servicios",
      subLinks: [
        { title: "Consultoría", url: "/servicios/consultoria", description: "Asesoría estratégica" },
        { title: "Desarrollo", url: "/servicios/desarrollo", description: "Soluciones a medida" },
      ]
    },
    { title: "Nosotros", url: "/nosotros" },
    { title: "Contacto", url: "/contacto" },
  ],
  buttons: [
    { title: "Comenzar", variant: "primary" as const },
  ],
};
