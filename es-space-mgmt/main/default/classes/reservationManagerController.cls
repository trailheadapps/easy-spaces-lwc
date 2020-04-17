public with sharing class reservationManagerController {
    //Note: This is a sample, so we're using 'LIMIT' to simulate proper set/pagination controls
    @auraEnabled(cacheable=true)
    public static List<customerServices.Customer> getCustomerList(
        String sObjectType
    ) {
        List<customerServices.Customer> customers = new List<customerServices.Customer>();
        if (sObjectType == 'Lead') {
            for (Lead l : [
                SELECT Id, Email, Name, City, State, Status
                FROM Lead
                WHERE
                    Status IN (
                        'Open - Not Contacted',
                        'New - Not Contacted',
                        'New'
                    )
                WITH SECURITY_ENFORCED
                LIMIT 5
            ]) {
                customerServices.Customer c = new customerServices.Customer(
                    l.Name,
                    l.Email,
                    l.City,
                    l.State,
                    l.Status,
                    l.Id
                );
                customers.add(c);
            }
        }
        if (sObjectType == 'Contact') {
            for (Contact c : [
                SELECT
                    Id,
                    Email,
                    Name,
                    MailingCity,
                    MailingState,
                    Reservation_Status__c
                FROM Contact
                WHERE Reservation_Status__c IN ('Not Started')
                WITH SECURITY_ENFORCED
                LIMIT 5
            ]) {
                customerServices.Customer cu = new customerServices.Customer(
                    c.Name,
                    c.Email,
                    c.MailingCity,
                    c.MailingState,
                    c.Reservation_Status__c,
                    c.Id
                );
                customers.add(cu);
            }
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
