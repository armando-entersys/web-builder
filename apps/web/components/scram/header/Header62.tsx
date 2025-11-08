import { Button } from "@scram_io/scram-ui";

type ImageProps = {
  src: string;
  alt?: string;
};

type Props = {
  heading: string;
  description: string;
  buttons: Array<{
    title: string;
    variant?: "primary" | "secondary";
  }>;
  images: [ImageProps, ImageProps, ImageProps];
};

export const Header62 = (props: Props) => {
  const { heading, description, buttons, images } = props;

  return (
    <section className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="grid grid-cols-1 gap-y-12 md:gap-y-16 lg:grid-cols-2 lg:items-center lg:gap-x-20">
          <div>
            <h1 className="mb-5 text-6xl font-bold md:mb-6 md:text-9xl lg:text-10xl">
              {heading}
            </h1>
            <p className="md:text-md">{description}</p>
            <div className="mt-6 flex gap-x-4 md:mt-8">
              {buttons.map((button, index) => (
                <Button key={index} variant={button.variant}>
                  {button.title}
                </Button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <img
                src={images[0].src}
                className="aspect-[3/2] w-full object-cover"
                alt={images[0].alt}
              />
            </div>
            {images.slice(1).map((image, index) => (
              <div key={index}>
                <img
                  src={image.src}
                  className="aspect-square w-full object-cover"
                  alt={image.alt}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

Header62.defaultProps = {
  heading: "Medium length hero heading goes here",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
  buttons: [
    { title: "Button", variant: "primary" as const },
    { title: "Button", variant: "secondary" as const },
  ],
  images: [
    {
      src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
      alt: "Placeholder image 1",
    },
    {
      src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
      alt: "Placeholder image 2",
    },
    {
      src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
      alt: "Placeholder image 3",
    },
  ],
};
