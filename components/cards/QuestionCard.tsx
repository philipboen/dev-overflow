import Link from "next/link";
import Tag from "../shared/Tag";
import Metric from "../shared/Metric";
import { formatNumber, getTimestamp } from "@/lib/utils";

interface Props {
  _id: string;
  title: string;
  tags: {
    _id: string;
    name: string;
  }[];
  author: {
    _id: string;
    name: string;
    profilePicture: string;
  };
  upvotes: number;
  views: number;
  answers: Array<object>;
  createdAt: Date;
}

const QuestionCard = ({
  _id,
  title,
  tags,
  author,
  upvotes,
  views,
  answers,
  createdAt,
}: Props) => {
  return (
    <div className="card-wrapper rounded-[10px] p-9 max-sm:rounded-none sm:px-8">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          <span className="xs-regular text-dark400_light600 mb-2 line-clamp-1 flex sm:hidden">
            {getTimestamp(createdAt)}
          </span>
          <Link href={`/question/${_id}`}>
            <h3 className="sm:h3-bold base-bold text-dark200_light870 line-clamp-3 flex-1 font-serif max-sm:text-dark-200 max-sm:dark:text-[#B3B3B3]">
              {title}
            </h3>
          </Link>
        </div>
        {/* // TODO:If signed in add edit and delete actions */}
      </div>
      <div className="mt-3.5 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Tag
            key={tag._id}
            _id={tag._id}
            name={tag.name}
            otherClasses="border-[#888] dark:border-none"
            textStyles="text-gray-500"
          />
        ))}
      </div>
      <div className="flexBetween mt-6 w-full flex-wrap gap-3">
        <Metric
          imgUrl={author.profilePicture}
          alt="user"
          value={author.name}
          title={` - asked ${getTimestamp(createdAt)}`}
          href={`/profile/${author._id}`}
          isAuthor
          textStyles="xs-medium max-sm:text-dark400_light600 text-dark-180 dark:text-light-700"
        />
        <div className="flex gap-4">
          <Metric
            imgUrl="/assets/icons/like.svg"
            alt="upvotes"
            value={formatNumber(upvotes)}
            title="Votes"
            textStyles="xs-medium max-sm:text-dark400_light600 text-dark-180 dark:text-light-700"
          />
          <Metric
            imgUrl="/assets/icons/message.svg"
            alt="message"
            value={answers.length}
            title="Answers"
            textStyles="xs-medium max-sm:text-dark400_light600 text-dark-180 dark:text-light-700"
          />
          <Metric
            imgUrl="/assets/icons/eye.svg"
            alt="eye"
            value={formatNumber(views)}
            title="Views"
            textStyles="xs-medium max-sm:text-dark400_light600 text-dark-180 dark:text-light-700"
          />
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
