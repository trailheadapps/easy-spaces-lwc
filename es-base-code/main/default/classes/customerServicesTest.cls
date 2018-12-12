@isTest
public class customerServicesTest {

    @isTest
    static void canFetchCustomerFields(){
        customerServices.Customer contact = customerServices.getCustomerFields('Contact');
        system.assertNotEquals(contact, NULL);
        customerServices.Customer lead = customerServices.getCustomerFields('Lead');
        system.assertNotEquals(lead, NULL);
        system.assertNotEquals(contact, lead);
    }

}
