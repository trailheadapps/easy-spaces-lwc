@isTest
private class ReservationManagerTest {
    @testSetup
    static void setup() {
        List<Account> accts = TestDataFactory.makeAccounts(15);
        List<Contact> contacts = TestDataFactory.makeContacts(25);
        List<Lead> leads = TestDataFactory.makeLeads(25);

        insert leads;
        insert accts;
        Integer counter = 0;
        for (Contact c : contacts) {
            c.AccountId = accts[counter].Id;
            counter++;
            if (counter >= accts.size())
                counter = 0;
        }
        insert contacts;
    }

    @isTest
    static void canUpdateLeadReservationStatus() {
        Lead lead = [SELECT Id FROM Lead LIMIT 1];
        ReservationManager.Requests request = new ReservationManager.Requests();
        request.recordId = lead.Id;
        List<Id> lstIds = ReservationManager.updateReservationStatus(
            new List<ReservationManager.Requests>{ request }
        );
        List<Customer_Fields__mdt> lstcmdts = [
            SELECT
                Customer_Status__r.QualifiedAPIName,
                Customer_Reservation_Status_Value__c
            FROM Customer_Fields__mdt
            WHERE Sobject_Type__r.QualifiedAPIName = 'Lead'
            WITH SECURITY_ENFORCED
            LIMIT 1
        ];
        Lead updatedLeadRecord = [
            SELECT Id, Status
            FROM Lead
            WHERE Id = :lstIds[0]
            LIMIT 1
        ];
        System.assertEquals(
            lstcmdts[0].Customer_Reservation_Status_Value__c,
            updatedLeadRecord.Status
        );
    }

    @isTest
    static void canUpdateContactReservationStatus() {
        Contact contact = [SELECT Id FROM Contact LIMIT 1];
        ReservationManager.Requests request = new ReservationManager.Requests();
        request.recordId = contact.Id;
        List<Id> lstIds = ReservationManager.updateReservationStatus(
            new List<ReservationManager.Requests>{ request }
        );
        List<Customer_Fields__mdt> lstcmdts = [
            SELECT
                Customer_Status__r.QualifiedAPIName,
                Customer_Reservation_Status_Value__c
            FROM Customer_Fields__mdt
            WHERE Sobject_Type__r.QualifiedAPIName = 'Contact'
            WITH SECURITY_ENFORCED
            LIMIT 1
        ];
        Contact updatedContactRecord = [
            SELECT Id, Reservation_Status__c
            FROM Contact
            WHERE Id = :lstIds[0]
            LIMIT 1
        ];
        System.assertEquals(
            lstcmdts[0].Customer_Reservation_Status_Value__c,
            updatedContactRecord.Reservation_Status__c
        );
    }
}
