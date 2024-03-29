import Link from "next/link";
import { Badge } from "../ui/badge";
import { formatNumber } from "@/lib/utils";

interface TagProps {
  _id: string;
  name: string;
  totalQuestions?: number;
  showCount?: boolean;
  otherClasses?: string;
  textStyles: string;
}

const Tag = ({
  _id,
  name,
  totalQuestions,
  showCount,
  otherClasses,
  textStyles,
}: TagProps) => {
  return (
    <Link href={`/tags/${_id}`}>
      <Badge
        className={`xs-medium flex-1 gap-2 bg-[#FAFAFA] ${otherClasses} px-3 py-[6px] dark:bg-dark-400`}
      >
        <p className={`${textStyles} dark:text-light-500`}>{name}</p>
        {showCount && (
          <p className="xs-medium leading-none text-gray-500 dark:text-light-700">
            {formatNumber(totalQuestions || 0)}
          </p>
        )}
      </Badge>
    </Link>
  );
};

export default Tag;
