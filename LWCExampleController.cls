public inherited sharing class LWCExampleController {

    @AuraEnabled(Cacheable = true)
    public static List<Project__c> getProjects(){
        return [SELECT Id, Name,Project_Type__c, Owner__c, End_Date__c,Status__c,Priority__c FROM Project__c];
    }
    
    @AuraEnabled
    public static void deleteProjects(list<Id> lstProIds){
        try {
            list<Project__c> lstProsToDelete = new list<Project__c>();
            System.debug('lstProIds ====> '+lstProIds);
            for(Id idPro : lstProIds) {
                lstProsToDelete.add(new Project__c(Id = idPro));
            }
            if(!lstProsToDelete.isEmpty()) {
                delete lstProsToDelete;
            }
        }
        catch(Exception ex) {
            throw new AuraHandledException(ex.getMessage());
        }
    }
}