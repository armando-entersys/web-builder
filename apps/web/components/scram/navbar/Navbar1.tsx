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
    variant?: "primary" | "secondary" | "link";
  }>;
};

export const Navbar1 = (props: Props) => {
  const { logo, navLinks, buttons } = props;

  return (
    <nav className="flex w-full items-center justify-between px-[5%] py-4 md:py-6">
      <a href={logo.url}>
        <img src={logo.src} alt={logo.alt} className="h-8 md:h-10" />
      </a>

      <div className="hidden items-center gap-8 lg:flex">
        {navLinks.map((link, index) => (
          <a
            key={index}
            href={link.url}
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            {link.title}
          </a>
        ))}
      </div>

      <div className="flex items-center gap-4">
        {buttons.map((button, index) => (
          <Button key={index} variant={button.variant || "primary"}>
            {button.title}
          </Button>
        ))}
      </div>
    </nav>
  );
};

// Default props for demo
Navbar1.defaultProps = {
  logo: {
    url: "/",
    src: "https://via.placeholder.com/150x50",
    alt: "Logo"
  },
  navLinks: [
    { title: "Inicio", url: "/" },
    { title: "Servicios", url: "/servicios" },
    { title: "Nosotros", url: "/nosotros" },
    { title: "Contacto", url: "/contacto" },
  ],
  buttons: [
    { title: "Ingresar", variant: "secondary" as const },
    { title: "Comenzar", variant: "primary" as const },
  ],
};
