import type { FC } from 'react';
import { Link } from 'react-router';
import type { Campground } from '@my-project/shared';

type CardProps = Pick<Campground, '_id' | 'title' | 'description' | 'location' | 'image'>;

export const Card: FC<CardProps> = ({ _id, title, description, location, image }) => {
  return (
    <div className="flex flex-row rounded-lg shadow mb-4 overflow-hidden">
      {image && (
        <img
          src={image}
          alt={title}
          className="w-64 shrink-0 object-cover"
        />
      )}
      <div className="flex flex-col gap-2 p-4">
        <h5 className="text-xl font-semibold">{title}</h5>
        <p className="text-gray-700">{description}</p>
        <p className="text-sm text-gray-500">{location}</p>
        <Link
          to={`/campgrounds/${_id}`}
          className="self-start mt-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          View {title}
        </Link>
      </div>
    </div>
  );
};