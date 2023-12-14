import { FuseResult } from "fuse.js";
import { CommandItem, CommandGroup } from "@/srch/ui/command";
import * as LucideIcons from 'lucide-react'

export const ItemRender = ({
  result,
  index,
}: {
  result: FuseResult<any>;
  index: number;
}) => {
  const { title, text } = result.item;
  const Icon = (LucideIcons as Record<string, any>)[result.item.icon]

  return (
    <div className="flex text-xs overflow-hidden items-center">
        {Icon && <Icon />}
        <div className="flex flex-col ml-2 tracking-wide">
          <span className="font-medium">{title}</span>
          <span className="font-light">{text}</span>
        </div>
    </div>
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
                <CommandItem key={idx}>
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
