public with sharing class ReservationManager {
    @InvocableMethod(label='Update Reservation Status')
    public static List<Id> updateReservationStatus(
        List<Requests> recordsToUpdate
    ) {
        Schema.SObjectType sObjectType;
        SObject recordToUpdate;
        String objectName;
        List<Id> sucessIds = new List<Id>();
        if (recordsToUpdate.size() > 0) {
            // Safe navigate to avoid null pointers
            sObjectType = recordsToUpdate[0].recordId?.getSObjectType();
            objectName = sObjectType?.getDescribe()?.getName();
            // Query custom Metadata Records to update sObject type
            List<Customer_Fields__mdt> lstcmdts = [
                SELECT
                    Customer_Status__r.QualifiedAPIName,
                    Customer_Reservation_Status_Value__c
                FROM Customer_Fields__mdt
                WHERE Sobject_Type__r.QualifiedAPIName = :objectName
                WITH SECURITY_ENFORCED
                LIMIT 1
            ];
            if (lstcmdts.size() == 1) {
                Customer_Fields__mdt cmdt = lstcmdts[0];
                recordToUpdate = sObjectType.newSObject(
                    recordsToUpdate[0].recordId
                );
                recordToUpdate.put(
                    cmdt.Customer_Status__r.QualifiedAPIName,
                    cmdt.Customer_Reservation_Status_Value__c
                );
                // Check for CRUD and FLS
                SObjectAccessDecision decision = Security.stripInaccessible(
                    AccessType.UPDATABLE,
                    new List<SObject>{ recordToUpdate },
                    true
                );
                List<SObject> lstToUpdate = decision.getRecords();
                try {
                    update lstToUpdate;
                    sucessIds.add(lstToUpdate[0].Id);
                } catch (exception e) {
                    throw new ReservationManagerException(e.getMessage());
                }
            }
        }
        return sucessIds;
    }

    public class Requests {
        @InvocableVariable
        public Id recordId;
    }

    public class ReservationManagerException extends Exception {
    }
}
