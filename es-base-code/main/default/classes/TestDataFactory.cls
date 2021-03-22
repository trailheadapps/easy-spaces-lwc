@isTest
public class TestDataFactory {
    public static List<Account> makeAccounts(Integer acctNum) {
        //make some Accounts
        List<Account> testAccts = new List<Account>();
        for (Integer x = 0; x < acctNum; x++) {
            Account a = new Account();
            a.Name = 'Test Account' + x;
            testAccts.add(a);
        }
        return testAccts;
    }

    public static List<Contact> makeContacts(Integer contactNum) {
        List<Contact> testPeeps = new List<Contact>();
        for (Integer x = 0; x < contactNum; x++) {
            Contact c = new Contact();
            c.FirstName = 'Testing' + x;
            c.LastName = 'Contact' + x;
            c.MailingCity = 'Test City' + x;
            c.MailingStreet = 'Test City Ave' + x;
            c.MailingState = Math.mod(x, 2) == 0
                ? null
                : (Math.mod(x, 3) == 0 ? 'NY' : 'OR');
            c.MailingPostalCode = Math.mod(x, 2) == 0
                ? '1011 AJ'
                : (Math.mod(x, 3) == 0 ? '10006' : '97230');
            c.MailingCountry = Math.mod(x, 2) == 0
                ? 'Amsterdam'
                : 'United States';
            c.Reservation_Status__c = 'Not Started';
            testPeeps.add(c);
        }
        return testPeeps;
    }

    public static List<Lead> makeLeads(Integer leadNum) {
        List<Lead> testPeeps = new List<Lead>();
        for (Integer x = 0; x < leadNum; x++) {
            Lead l = new Lead();
            l.FirstName = 'Test' + x;
            l.LastName = 'Lead' + x;
            l.Company = 'Test Company' + x;
            l.City = 'Test City' + x;
            l.Street = 'Test Street' + x;
            l.State = Math.mod(x, 2) == 0
                ? null
                : (Math.mod(x, 3) == 0 ? 'NY' : 'OR');
            l.Country = Math.mod(x, 2) == 0 ? 'Amsterdam' : 'United States';
            l.PostalCode = Math.mod(x, 2) == 0
                ? '1011 AZ'
                : (Math.mod(x, 3) == 0 ? '10006' : '97230');
            testPeeps.add(l);
        }
        return testPeeps;
    }

    public static List<Market__c> makeMarkets(Integer marketsNum) {
        List<Market__c> markets = new List<Market__c>();
        for (Integer x = 0; x < marketsNum; x++) {
            Market__c m = new Market__c();
            m.Name = 'Test Market' + x;
            m.City__c = 'Test City' + x;
            m.State__c = Math.mod(x, 2) == 0
                ? null
                : (Math.mod(x, 3) == 0 ? 'NY' : 'OR');
            m.Country__c = Math.mod(x, 2) == 0 ? 'Amsterdam' : 'United States';
            markets.add(m);
        }
        return markets;
    }

    public static List<Space__c> makeSpaces(Integer spacesNum) {
        List<Space__c> spaces = new List<Space__c>();
        for (Integer x = 0; x < spacesNum; x++) {
            Space__c s = new Space__c();
            s.Name = 'Test Space - ' + x;
            s.Daily_Booking_Rate__c = Decimal.valueOf((x + 10) * 1000);
            s.Category__c = Math.mod(x, 2) == 0
                ? 'Cooking Classroom'
                : (Math.mod(x, 3) == 0 ? 'Café' : 'Exploration Lab');
            s.Maximum_Capacity__c = (x + 1) * 10;
            s.Minimum_Capacity__c = x + 1;
            s.Picture_URL__c = 'https://pics.net.com/' + x;
            s.Type__c = Math.mod(x, 2) == 0
                ? 'Conversation Starter;Large Groups;Outdoor;Energizing;Scheduled Activity'
                : (Math.mod(x, 3) == 0
                      ? 'Individuals or Small Groups;Come-and-Go;Indoor;Relaxing;Quiet'
                      : 'Scheduled Activity;Come-and-Go;Indoor;Outdoor;Large Groups;Relaxing;Conversation Starter');
            spaces.add(s);
        }
        return spaces;
    }

    public static List<Reservation__c> makeReservations(Integer resvNumber) {
        List<Reservation__c> resrvs = new List<Reservation__c>();
        for (Integer x = 0; x < resvNumber; x++) {
            Reservation__c r = new Reservation__c();
            r.Start_Date__c = Date.today();
            r.End_Date__c = Date.today().addDays(x);
            r.Total_Number_of_Guests__c = x + 10;
            resrvs.add(r);
        }
        return resrvs;
    }
}
