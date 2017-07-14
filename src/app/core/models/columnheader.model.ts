/**
 * Created by vikram.chirumamilla on 6/21/2017.
 */

export interface ColumnHeader {
  title: string;
  name: string;
  type: string;
  sort?: 'desc' | 'asc' | '';
}
