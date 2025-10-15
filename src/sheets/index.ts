import { registerSheet, SheetDefinition } from 'react-native-actions-sheet';
import DropdownSheet from '@/components/DropdownSheet';

// Registrar todos los ActionSheets
registerSheet('dropdown-sheet', DropdownSheet);

declare module 'react-native-actions-sheet' {
  interface Sheets {
    'dropdown-sheet': SheetDefinition;
  }
}

export {}