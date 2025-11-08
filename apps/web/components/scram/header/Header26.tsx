import { Button } from "@relume_io/relume-ui";

type ImageProps = {
  src: string;
  alt?: string;
};

type Props = {
  tagline: string;
  heading: string;
  description: string;
  buttons: Array<{
    title: string;
    variant?: "primary" | "secondary";
  }>;
  image: ImageProps;
};

export const Header26 = (props: Props) => {
  const { tagline, heading, description, buttons, image } = props;

  return (
    <section className="relative px-[5%]">
      <div className="container">
        <div className="flex min-h-svh flex-col items-center justify-center py-16 text-center md:py-24 lg:py-28">
          <div className="mb-6 md:mb-8">
            <p className="mb-3 font-semibold md:mb-4">{tagline}</p>
            <h1 className="mb-5 text-6xl font-bold md:mb-6 md:text-9xl lg:text-10xl">
              {heading}
            </h1>
            <p className="md:text-md">{description}</p>
          </div>
          <div className="flex gap-x-4">
            {buttons.map((button, index) => (
              <Button key={index} variant={button.variant}>
                {button.title}
              </Button>
            ))}
          </div>
          <div className="absolute inset-0 -z-10">
            <img
              src={image.src}
              className="h-full w-full object-cover"
              alt={image.alt}
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>
        </div>
      </div>
    </section>
  );
};

Header26.defaultProps = {
  tagline: "Tagline",
  heading: "Medium length hero heading goes here",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
  buttons: [
    { title: "Button", variant: "primary" as const },
    { title: "Button", variant: "secondary" as const },
  ],
  image: {
    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
    alt: "Placeholder image",
  },
};
