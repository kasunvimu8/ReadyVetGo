import { SheetActionTypes, OPEN_SHEET, CLOSE_SHEET } from "@/types/sheetAction"

interface SheetState {
  isOpen: boolean;
  contentKey: string | null;
}

const initialState: SheetState = {
  isOpen: false,
  contentKey: null,
};

const sheetReducer = (state = initialState, action: SheetActionTypes): SheetState => {
  switch (action.type) {
    case OPEN_SHEET:
      return {
        ...state,
        isOpen: true,
        contentKey: action.payload,
      };
    case CLOSE_SHEET:
      return {
        ...state,
        isOpen: false,
        contentKey: null,
      };
    default:
      return state;
  }
};

export default sheetReducer;
