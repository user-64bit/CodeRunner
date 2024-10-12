import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"


export function Combobox({ frameworks, className, language, setLanguage }: {
  frameworks: {
    value: string;
    label: string;
  }[],
  className?: string,
  language: string,
  setLanguage: (value: string) => void;
},
) {
  const [open, setOpen] = useState(false)

  return (
    <div className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {language
              ? frameworks.find((framework) => framework.value === language)?.label
              : "Select framework..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 PopoverContent">
          <Command>
            <CommandInput placeholder="Search framework..." />
            <CommandList className="w-full">
              <CommandEmpty>No framework found.</CommandEmpty>
              <CommandGroup className="w-full">
                {frameworks.map((framework) => (
                  <CommandItem
                    className=""
                    key={framework.value}
                    value={framework.value}
                    onSelect={(currentValue) => {
                      setLanguage(currentValue === language ? "" : currentValue)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        language === framework.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {framework.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
