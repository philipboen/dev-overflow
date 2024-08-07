"use client";

import React, { useState, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { QuestionsSchema } from "@/lib/validations";
import * as z from "zod";
import { Editor } from "@tinymce/tinymce-react";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "../ui/badge";
import Image from "next/image";
import { createQuestion } from "@/lib/actions/question.action";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { getActualTheme } from "@/lib/utils";
import { TINY_CSS_CLASSES } from "@/constants";

const type: any = "create";

interface Props {
  mongoUserId: string;
}

const Question = ({ mongoUserId }: Props) => {
  const editorRef = useRef(null);
  const { theme } = useTheme();
  const actualTheme = getActualTheme(theme || "light");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // 1. Define your form.
  const form = useForm<z.infer<typeof QuestionsSchema>>({
    resolver: zodResolver(QuestionsSchema),
    defaultValues: {
      title: "",
      explanation: "",
      tags: [],
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof QuestionsSchema>) {
    setIsSubmitting(true);

    try {
      // make an async call to your API -> create a new question
      // contain all form data

      await createQuestion({
        title: values.title,
        content: values.explanation,
        tags: values.tags,
        author: JSON.parse(mongoUserId),
        path: pathname,
      });

      // navigate to home page
      router.push("/");
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: any
  ) => {
    if (e.key === "Enter" && field.name === "tags") {
      e.preventDefault();

      const tagInput = e.target as HTMLInputElement;
      const tagValue = tagInput.value.trim();

      if (tagValue !== "") {
        if (tagValue.length > 20) {
          return form.setError("tags", {
            type: "required",
            message: "Tag must be less than 20 characters",
          });
        }

        if (!field.value.includes(tagValue as never)) {
          form.setValue("tags", [...field.value, tagValue]);
          tagInput.value = "";
          form.clearErrors("tags");
        }
      } else {
        form.trigger();
      }
    }
  };

  const handleTagRemove = (tag: string, field: any) => {
    const newTags = field.value.filter((t: string) => t !== tag);
    form.setValue("tags", newTags);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-10"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="base-semibold text-dark400_light800 max-sm:text-dark400_light600 font-serif">
                Question Title <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <Input
                  {...field}
                  className="no-focus base-regular background-light800_dark300 dark:light-border-2 text-dark300_light700 min-h-[50px] border border-[#888] pl-4"
                />
              </FormControl>
              <FormDescription className="xs-regular mt-2.5 text-gray-600 dark:text-light-500">
                Be specific and imagine you&apos;re asking a question to another
                person
              </FormDescription>
              <FormMessage className="xs-regular text-red-600" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="explanation"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-2">
              <FormLabel className="base-semibold text-dark400_light800 max-sm:text-dark400_light600 font-serif">
                Detailed explanation of your problem{" "}
                <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <Editor
                  key={actualTheme}
                  apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                  onInit={(evt, editor) => {
                    // @ts-ignore
                    editorRef.current = editor;
                  }}
                  onBlur={field.onBlur}
                  onEditorChange={(content) => field.onChange(content)}
                  initialValue=""
                  init={{
                    height: 350,
                    menubar: false,
                    plugins: [
                      "advlist",
                      "autolink",
                      "lists",
                      "link",
                      "image",
                      "charmap",
                      "preview",
                      "anchor",
                      "searchreplace",
                      "visualblocks",
                      "codesample",
                      "fullscreen",
                      "insertdatetime",
                      "media",
                      "table",
                    ],
                    codesample_languages: [
                      { text: "html/xml", value: "markup" },
                      { text: "css", value: "css" },
                      { text: "javascript", value: "javascript" },
                      { text: "jsx", value: "jsx" },
                      { text: "typescrpt", value: "typescript" },
                      { text: "tsx", value: "tsx" },
                      { text: "php", value: "php" },
                      { text: "json", value: "json" },
                      { text: "sql", value: "sql" },
                      { text: "python", value: "python" },
                      { text: "java", value: "java" },
                      { text: "c", value: "c" },
                      { text: "c++", value: "cpp" },
                      { text: "c#", value: "csharp" },
                      { text: "VB.NET", value: "vbnet" },
                      { text: "ruby", value: "ruby" },
                      { text: "rust", value: "rust" },
                      { text: "yaml", value: "yaml" },
                      { text: "bash", value: "bash" },
                    ],
                    toolbar:
                      "undo redo | blocks | " +
                      "codesample | bold italic forecolor | alignleft aligncenter " +
                      "alignright alignjustify | bullist numlist",
                    skin: actualTheme === "dark" ? "oxide-dark" : "oxide",
                    content_css: actualTheme === "dark" ? "dark" : "default",
                    content_style: TINY_CSS_CLASSES,
                    highlight_on_focus: false,
                  }}
                />
              </FormControl>
              <FormDescription className="xs-regular mt-2.5 text-gray-600 dark:text-light-500">
                Introduce the problem and expand on what you put in the title.
                Minimum 20 characters.
              </FormDescription>
              <FormMessage className="xs-regular text-red-600" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="base-semibold text-dark400_light800 max-sm:text-dark400_light600 font-serif">
                Tags <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <>
                  <Input
                    className="no-focus base-regular background-light800_dark300 dark:light-border-2 text-dark300_light700 min-h-[50px] border border-[#888] pl-4"
                    placeholder="Add tags..."
                    onKeyDown={(e) => handleInputKeyDown(e, field)}
                  />

                  {field.value.length > 0 && (
                    <div className="flexStart mt-2.5 gap-2.5">
                      {field.value.map((tag: any) => (
                        <Badge
                          key={tag}
                          className="xs-medium max-sm:subtle-medium text-light900_light500 flex items-center justify-center gap-2 rounded-md border-none bg-slate-800 px-4 py-2 font-serif dark:bg-dark-300"
                        >
                          {tag}
                          <Image
                            src="/assets/icons/close.svg"
                            alt="close"
                            width={12}
                            height={12}
                            className="cursor-pointer object-contain invert"
                            onClick={() => handleTagRemove(tag, field)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </>
              </FormControl>
              <FormDescription className="xs-regular mt-2.5 text-gray-600 dark:text-light-500">
                Add up to 4 tags to describe what your question is about. Start
                typing to see suggestions.
              </FormDescription>
              <FormMessage className="xs-regular text-red-600" />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="primary-gradient mb-6 w-fit self-end !text-light-900 max-sm:mb-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>{type === "edit" ? "Updating..." : "Posting..."}</>
          ) : (
            <>{type === "edit" ? "Edit Question" : "Ask a Question"}</>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default Question;
