import { LightningElement, wire } from "lwc";
import { CurrentPageReference, NavigationMixin } from "lightning/navigation";
import getBaseAppUrl from "@salesforce/apex/UtilityLauncherController.getBaseAppUrl";
export default class UtilityLauncher extends NavigationMixin(LightningElement) {
  recordId;

  @wire(CurrentPageReference)
  handlePageRef(pageRef) {
    if (pageRef?.type === "standard__recordPage") {
      this.recordId = pageRef.attributes?.recordId;
    } else {
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

    // window.open(`/app/c__multiframework_reloaded/record/${this.recordId}`);
  }
}
