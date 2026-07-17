import { LightningElement, wire } from "lwc";
import { CurrentPageReference, NavigationMixin } from "lightning/navigation";
import { getRecord, getFieldValue } from "lightning/uiRecordApi";
import getBaseAppUrl from "@salesforce/apex/UtilityLauncherController.getBaseAppUrl";
export default class UtilityLauncher extends NavigationMixin(LightningElement) {
  recordId;
  objectName;
  showRecordDetails;
  recordName;
  createdDate;

  // Build the field references reactively from the runtime object name.
  // getRecord re-fetches whenever `fields` changes.
  get fields() {
    if (!this.objectName) {
      return [];
    }
    return [`${this.objectName}.Name`, `${this.objectName}.CreatedDate`];
  }

  @wire(getRecord, { recordId: "$recordId", fields: "$fields" })
  handleRecord({ data, error }) {
    if (data) {
      this.recordName = getFieldValue(data, `${this.objectName}.Name`);
      this.createdDate = getFieldValue(data, `${this.objectName}.CreatedDate`);
    } else if (error) {
      this.recordName = undefined;
      this.createdDate = undefined;
    }
  }

  @wire(CurrentPageReference)
  handlePageRef(pageRef) {
    if (pageRef?.type === "standard__recordPage") {
      this.recordId = pageRef.attributes?.recordId;
      this.objectName = pageRef.attributes?.objectApiName;
      this.showRecordDetails = true;
    } else if (pageRef?.type === "standard__objectPage") {
      this.objectName = pageRef.attributes?.objectApiName;
      this.showRecordDetails = true;
      this.recordId = undefined;
    } else {
      this.showRecordDetails = false;
      this.objectName = undefined;
      this.recordId = undefined;
    }
  }
  launchRecordPage() {
    getBaseAppUrl().then((url) => {
      this[NavigationMixin.Navigate]({
        type: "standard__webPage",
        attributes: {
          url: `${url}/record/${this.recordId}`
        }
      });
    });
  }

  launchExportPage() {
    getBaseAppUrl().then((url) => {
      this[NavigationMixin.Navigate]({
        type: "standard__webPage",
        attributes: {
          url: `${url}/export`
        }
      });
    });
  }
}
