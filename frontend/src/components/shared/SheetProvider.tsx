import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/lib/store"
import { closeSheet, openSheet } from "@/types/sheetAction"
import { Sheet } from "@/components/ui/sheet.tsx"
import SheetContents from "@/components/shared/SheetContents.tsx"
import { SheetContent } from "@/components/ui/sheet"


/**
 * This component is to display the sheet component.
 */
const SheetProvider = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {isOpen, contentKey} = useSelector((state: RootState) => state.sheet);

  const handleChangeSheetState = (newIsOpen: boolean) => {
    if (newIsOpen && contentKey) {
      dispatch(openSheet(contentKey));
    } else {
      dispatch(closeSheet());
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleChangeSheetState}>
      <SheetContent className="flex items-center justify-center h-full w-full sm:max-w-md">
        {contentKey ? SheetContents[contentKey] : null}
      </SheetContent>
    </Sheet>
  );
};

export default SheetProvider;