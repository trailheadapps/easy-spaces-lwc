public inherited sharing class MarketServices {
    @auraEnabled(cacheable=true)
    public static List<Space__c> getRelatedSpaces(Id recordId) {
        return [
            SELECT
                Id,
                Daily_Booking_Rate__c,
                Name,
                Market__c,
                Maximum_Capacity__c,
                Minimum_Capacity__c,
                Picture_URL__c,
                Category__c,
                Type__c
            FROM Space__c
            WHERE Market__c = :recordId
            WITH SECURITY_ENFORCED
        ];
    }
}
