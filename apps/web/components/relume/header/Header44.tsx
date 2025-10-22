import { Button } from "@relume_io/relume-ui";

type VideoProps = {
  src: string;
  poster?: string;
};

type Props = {
  heading: string;
  description: string;
  buttons: Array<{
    title: string;
    variant?: "primary" | "secondary";
  }>;
  video: VideoProps;
};

export const Header44 = (props: Props) => {
  const { heading, description, buttons, video } = props;

  return (
    <section className="relative px-[5%]">
      <div className="container">
        <div className="flex min-h-svh flex-col items-center justify-center py-16 text-center md:py-24 lg:py-28">
          <div className="mb-6 w-full max-w-lg md:mb-8">
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
            <video
              className="h-full w-full object-cover"
              autoPlay
              loop
              muted
              playsInline
              poster={video.poster}
            >
              <source src={video.src} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/50" />
          </div>
        </div>
      </div>
    </section>
  );
};

Header44.defaultProps = {
  heading: "Medium length hero heading goes here",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
  buttons: [
    { title: "Button", variant: "primary" as const },
    { title: "Button", variant: "secondary" as const },
  ],
  video: {
    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-video.mp4",
    poster: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
  },
};
