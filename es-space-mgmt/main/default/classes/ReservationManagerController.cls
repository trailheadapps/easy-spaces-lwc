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
        draftStatus = c.Customer_Draft_Status_Values__c?.split(',');

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
        query += ' WITH SECURITY_ENFORCED ORDER BY CreatedDate DESC LIMIT 5';

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
}
