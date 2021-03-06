import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CompanyMapper } from '../../shared/services/mapper/company.mapper';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CompanyDto } from '../../shared/model/api/OkrUnit/company.dto';
import { CompanyUnit } from '../../shared/model/ui/OrganizationalUnit/company-unit';
import { DialogComponent } from '../../shared/components/dialog-component/dialog.component';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { ValidationErrorService } from '../../shared/services/helper/validation-error.service';

interface CompanyFormData {
  company?: CompanyUnit;
}

@Component({
  selector: 'app-okr-unit-form',
  templateUrl: './okr-unit-form.component.html',
  styleUrls: ['./okr-unit-form.component.scss']
})

export class OkrUnitFormComponent {
  companyForm: FormGroup;
  title: string;

  constructor(private dialogRef: MatDialogRef<DialogComponent<CompanyFormData>>,
              private companyMapper: CompanyMapper,
              private i18n: I18n,
              @Inject(MAT_DIALOG_DATA) private formData: CompanyFormData,
              private x: ValidationErrorService) {
    this.companyForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      label: new FormControl(this.getDefaultLabel(), [Validators.required, Validators.minLength(1), Validators.maxLength(255)])
    });

    if (this.formData.company) {
      this.companyForm.patchValue(this.formData.company);
    }

    const saveText: string = this.i18n({
        id: 'component_companyForm_saveText',
        value: ' {{label}} speichern.'
      }, {label: this.getDefaultLabel()}
    );
    const createText: string = this.i18n({
        id: 'component_companyForm_createText',
        value: '{{label}} erstellen.'
      }, {label: this.getDefaultLabel()});

    this.title = this.formData.company ? saveText : createText;
  }

  saveCompany(): void {
    const company: CompanyUnit = this.formData.company;

    if (company) {
      company.name = this.companyForm.get('name').value;
      company.label = this.companyForm.get('label').value;
      this.dialogRef.close(this.companyMapper.putCompany$(company));
    } else {
      const formData: CompanyUnit = this.companyForm.getRawValue();
      const newCompany: CompanyDto = {unitName: formData.name, cycleId: formData.cycleId, label: formData.label};
      this.dialogRef.close(this.companyMapper.postCompany$(newCompany));
    }
  }

  private getDefaultLabel(): string {
    if (this.formData.company) {
      return this.formData.company.label;
    } else {
      return this.i18n({id: 'schema', value: 'Struktur'});
    }
  }
}
