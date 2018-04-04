/**
 * Created by vikram.chirumamilla on 8/21/2017.
 */

import { Injectable } from '@angular/core';

import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';

import { DocumentType } from './models/enums/documenttype';

@Injectable()
export class DocumentsService {

  constructor() {
  }

  getEFLLink(id: string) {
    const eflPath = `/get/type/${DocumentType[DocumentType.EFL]}/id/${id}`;
    return environment.Documents_Url.concat(eflPath);
  }

  getTOSLink(isFixed: boolean) {
    let tosPath = '';
    if (isFixed) {
      tosPath = `/get/type/${DocumentType[DocumentType.FTOS]}`;
    } else {
      tosPath = `/get/type/${DocumentType[DocumentType.VTOS]}`;
    }
    return environment.Documents_Url.concat(tosPath);
  }

  getTOSLinkWithFeeId(isFixed: boolean, feeId: string): string {
    let tosPath = '';
    if (isFixed) {
      tosPath = `/get/type/${DocumentType[DocumentType.FTOS]}/feeId/${feeId}`;
    } else {
      tosPath = `/get/type/${DocumentType[DocumentType.VTOS]}/feeId/${feeId}`;
    }
    return environment.Documents_Url.concat(tosPath);
  }

  getYRAACLink() {
    const yraacPath = `/get/type/${DocumentType[DocumentType.YRAAC]}`;
    return environment.Documents_Url.concat(yraacPath);
  }
}
