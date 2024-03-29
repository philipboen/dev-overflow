import { Input } from "@/components/ui/input";
import Image from "next/image";

const GlobalSearch = () => {
  return (
    <div className="relative w-full max-w-[550px] rounded-[10px] border border-[#888] max-lg:hidden dark:border-dark-400">
      <div className="background-light800_darkgradient relative flex min-h-[45px] grow items-center gap-1 rounded-xl px-4">
        <Image
          src="/assets/icons/search.svg"
          alt="search"
          width={20}
          height={20}
          className="cursor-pointer"
        />
        <Input
          type="text"
          placeholder="Search for anything..."
          className="sm-regular no-focus placeholder text-dark400_light700 border-none bg-transparent shadow-none outline-none"
        />
      </div>
    </div>
  );
};

export default GlobalSearch;
