@isTest
public class reservationManagerControllerTest {
    
    @testSetup
    static void setup(){
        List<Account> accts = testDataFactory.makeAccounts(15);
        List<Contact> contacts = testDataFactory.makeContacts(25);
        List<Lead> leads = testDataFactory.makeLeads(25);
        List<Market__c> markets = testDataFactory.makeMarkets(25);
        List<Space__c> allSpaces = new List<Space__c>();
        List<Reservation__c> reservs = testDataFactory.makeReservations(12);

        insert leads;
        insert accts;
        Integer counter = 0;
        for(Contact c: contacts){
            c.AccountId = accts[counter].Id;
            counter++;
            if(counter >= accts.size()) counter = 0; 
        }
        insert contacts;

        insert markets;
        for(Integer i=0;i <markets.size();i++){
            List<Space__c> spaces = testDataFactory.makeSpaces(12);
            for(Space__c s: spaces){
                s.Market__c = markets[i].Id;
            }
            allSpaces.addAll(spaces);
        }
        insert allSpaces;

        counter = 0;
        for(Reservation__c r: reservs){
            r.Market__c = markets[0].Id;
            if(Math.mod(counter, 2)==0){
                r.Contact__c = contacts[counter].Id;
                r.Status__c = 'Draft';
            }else{
                r.Lead__c = leads[counter].Id;
                r.Status__c = 'Not Started';
            }
            counter++;
        }
        insert reservs;

    }

    @isTest
    static void canFetchCustomers(){
        List<customerServices.Customer> contacts = reservationManagerController.getCustomerList('Contact');
        system.assertNotEquals(contacts, NULL);
        List<customerServices.Customer> leads = reservationManagerController.getCustomerList('Lead');
        system.assertNotEquals(leads, NULL);
        system.assertNotEquals(contacts, leads);
    }

    @isTest 
    static void canFetchOpenReservs(){
        List<Reservation__c> reservs = reservationManagerController.getOpenReservations();
        system.assertNotEquals(reservs, NULL);
        system.assertEquals(reservs.size(), 10);
    }

}
