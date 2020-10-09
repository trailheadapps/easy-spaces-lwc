public with sharing class ReservationManagerController {
    //Note: This is a sample, so we're using 'LIMIT' to simulate proper set/pagination controls
    @auraEnabled(cacheable=true)
    public static List<CustomerServices.Customer> getCustomerList(
        String sObjectType
    ) {
        List<CustomerServices.Customer> customers = new List<CustomerServices.Customer>();
        Customer_Fields__mdt c = [
            SELECT
                Customer_Name__r.QualifiedAPIName,
                Customer_Email__r.QualifiedAPIName,
                Customer_City__r.QualifiedAPIName,
                Customer_State__r.QualifiedAPIName,
                Customer_Status__r.QualifiedAPIName,
                Customer_Draft_Status_Values__c
            FROM Customer_Fields__mdt
            WHERE Sobject_Type__r.QualifiedAPIName = :sObjectType
            WITH SECURITY_ENFORCED
            LIMIT 1
        ];

        List<String> draftStatus = new List<String>();
        draftStatus = c.Customer_Draft_Status_Values__c.split(',');

        String query = 'SELECT ';
        query += c.Customer_Name__r.QualifiedAPIName + ', ';
        query += c.Customer_Email__r.QualifiedAPIName + ', ';
        query += c.Customer_City__r.QualifiedAPIName + ', ';
        query += c.Customer_State__r.QualifiedAPIName + ', ';
        query += c.Customer_Status__r.QualifiedAPIName + ', ';
        query += 'Id';
        query += ' FROM ' + sObjectType;
        if (draftStatus.size() > 0) {
            query +=
                ' WHERE ' +
                c.Customer_Status__r.QualifiedAPIName +
                ' IN: draftStatus';
        }
        query += ' WITH SECURITY_ENFORCED LIMIT 5';

        for (Sobject sobj : Database.query(query)) {
            CustomerServices.Customer customer = new CustomerServices.Customer(
                (String) sobj.get(c.Customer_Name__r.QualifiedAPIName),
                (String) sobj.get(c.Customer_Email__r.QualifiedAPIName),
                (String) sobj.get(c.Customer_City__r.QualifiedAPIName),
                (String) sobj.get(c.Customer_State__r.QualifiedAPIName),
                (String) sobj.get(c.Customer_Status__r.QualifiedAPIName),
                (String) sobj.get('Id')
            );
            customers.add(customer);
        }
        return customers;
    }

    @auraEnabled(cacheable=true)
    public static List<Reservation__c> getOpenReservations() {
        return [
            SELECT
                Id,
                Name,
                Contact__c,
                Contact__r.Name,
                Lead__c,
                Lead__r.Name,
                Market__c,
                Market__r.Name,
                Status__c,
                Start_Date__c,
                End_Date__c,
                Total_Number_of_Guests__c
            FROM Reservation__c
            WHERE Status__c IN ('Not Started', 'Draft')
            WITH SECURITY_ENFORCED
            LIMIT 10
        ];
    }

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
            sObjectType = recordsToUpdate[0].recordId.getSObjectType();
            objectName = sObjectType.getDescribe().getName();
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
