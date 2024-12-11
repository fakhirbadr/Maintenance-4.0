/* eslint-disable react/prop-types */
import { Card } from "@mui/material";

const CardStats = ({ imageSrc, title, description, link, ...props }) => {
  return (
    <Card {...props}>
      <a
        href={link}
        className="flex h-full  flex-col  md:flex-row md:max-w-full  w-full "
      >
        <img
          className="object-cover w-full my-auto rounded-t-lg md:h-auto md:w-1/3 md:rounded-none md:rounded-s-lg"
          src={imageSrc}
          alt={title}
        />
        <div className="flex flex-col justify-between p-4 leading-normal w-full md:w-2/3">
          <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-500 dark:text-white">
            {title}
          </h5>
          <p className="mb-3  font-normal text-gray-500 dark:text-gray-400">
            {description} {/* Ceci permet de recevoir du JSX directement */}
          </p>
        </div>
      </a>
    </Card>
  );
};

export default CardStats;
