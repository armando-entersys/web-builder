import { Button } from "@scram_io/scram-ui";

type NavLink = {
  title: string;
  url: string;
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

export const Navbar3 = (props: Props) => {
  const { logo, navLinks, buttons } = props;

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container flex h-16 items-center justify-between px-[5%]">
        <a href={logo.url} className="flex items-center">
          <img src={logo.src} alt={logo.alt} className="h-8" />
        </a>

        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link, index) => (
            <a
              key={index}
              href={link.url}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {link.title}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {buttons.map((button, index) => (
            <Button key={index} variant={button.variant || "primary"} size="sm">
              {button.title}
            </Button>
          ))}
        </div>
      </div>
    </nav>
  );
};

Navbar3.defaultProps = {
  logo: {
    url: "/",
    src: "https://via.placeholder.com/150x50",
    alt: "Logo"
  },
  navLinks: [
    { title: "Inicio", url: "/" },
    { title: "Servicios", url: "/servicios" },
    { title: "Nosotros", url: "/nosotros" },
    { title: "Blog", url: "/blog" },
    { title: "Contacto", url: "/contacto" },
  ],
  buttons: [
    { title: "Comenzar Ahora", variant: "primary" as const },
  ],
};
