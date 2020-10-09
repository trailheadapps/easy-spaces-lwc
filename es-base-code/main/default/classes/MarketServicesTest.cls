@isTest
public class MarketServicesTest {
    @testSetup
    static void setup() {
        List<Account> accts = testDataFactory.makeAccounts(15);
        List<Contact> contacts = testDataFactory.makeContacts(25);
        List<Lead> leads = testDataFactory.makeLeads(25);
        List<Market__c> markets = testDataFactory.makeMarkets(25);
        List<Space__c> allSpaces = new List<Space__c>();

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

        insert markets;
        for (Integer i = 0; i < markets.size(); i++) {
            List<Space__c> spaces = testDataFactory.makeSpaces(12);
            for (Space__c s : spaces) {
                s.Market__c = markets[i].Id;
            }
            allSpaces.addAll(spaces);
        }
        system.debug(allSpaces.size());
        insert allSpaces;
    }

    @isTest
    static void canFetchRelatedSpaces() {
        List<Market__c> markets = [SELECT Id FROM Market__c LIMIT 5];
        List<Space__c> one = marketServices.getRelatedSpaces(markets[0].Id);
        List<Space__c> two = marketServices.getRelatedSpaces(markets[3].Id);
        system.assertNotEquals(one, null);
        system.assertNotEquals(two, null);
        system.assertNotEquals(one, two);
        system.assertEquals(one.size(), 12);
        system.assertEquals(two.size(), 12);
    }
}
