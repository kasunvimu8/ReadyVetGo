/**
 * Used for the global state managing the sheet component.
 */

export const OPEN_SHEET = 'OPEN_SHEET';
export const CLOSE_SHEET = 'CLOSE_SHEET';

// This will be used to open the sheet. The sheet component will display the payload.
interface OpenSheetAction {
  type: typeof OPEN_SHEET;
  payload: string;
}

// This will be used to close the sheet.
interface CloseSheetAction {
  type: typeof CLOSE_SHEET;
}

export type SheetActionTypes = OpenSheetAction | CloseSheetAction;

export const openSheet = (contentKey: string): OpenSheetAction => ({
  type: OPEN_SHEET,
  payload: contentKey,
});

export const closeSheet = (): CloseSheetAction => ({
  type: CLOSE_SHEET,
});