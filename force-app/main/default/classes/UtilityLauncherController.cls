public with sharing class UtilityLauncherController {
  @AuraEnabled
  public static String getBaseAppUrl() {
    String myDomain = DomainCreator.getOrgMyDomainHostname();
    // connect-velocity-268-dev-ed.scratch.my.salesforce.com
    String appHost = myDomain
      .replaceFirst('\\.', '--c.')
      .replace('my.salesforce.com', 'my.salesforce.app');
    // connect-velocity-268-dev-ed--c.scratch.my.salesforce.app
    String baseUrl = 'https://' + appHost + '/app/c__multiframework_reloaded';
    return baseUrl;
  }
}
