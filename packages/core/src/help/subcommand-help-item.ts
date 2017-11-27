export interface SubcommandHelpItem {
  name: string;
  aliases: string[];
  brief: string | undefined;
  group: number;
  overridden?: boolean;
}
