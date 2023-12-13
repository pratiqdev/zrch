import { FuseResult } from "fuse.js";
import { CommandItem, CommandGroup } from "../ui/command";
import * as LucideIcons from 'lucide-react'

export const ItemRender = ({
  result,
  index,
  onSelect,
}: {
  result: FuseResult<any>;
  index: number;
  onSelect: (value: any) => void;
}) => {
  const { title, text } = result.item;
  const Icon = (LucideIcons as Record<string, any>)[result.item.icon]

  return (
    <>
      <CommandItem onSelect={(e) => console.log("selected:", e)}>
        {/* {SelectedIcon && <SelectedIcon className="mr-2 h-4 w-4 min-w-[1.5rem] text-indigo-500" />} */}
        <div className="flex flex-col text-xs overflow-hidden">
            <Icon />
            <span className="font-medium">{title}</span>
            <span className="font-medium">{text}</span>
        </div>
      </CommandItem>
    </>
  );
};

export const ListRender = ({
  results,
  groupedResults,
  value,
  onSelect,
}: {
  results: FuseResult<any>[];
  groupedResults: [string, FuseResult<any>[]][];
  value: string;
  onSelect: (value: any) => void;
}) => {
  return (
    <>
      {groupedResults?.map(([section, data]: [string, FuseResult<any>[]]) => (
        <CommandGroup key={section} heading={section} hidden={!data.length}>
          {data.map((d, idx) => {
            const Icon = (LucideIcons as Record<string, any>)[d.item.icon]
            return (
                <CommandItem>
                    <Icon />
                    <span>{d.item.title}</span>
                    <span>{d.item.text}</span>
                </CommandItem>
            )
        })}
        </CommandGroup>
      ))}
    </>
  );
};
