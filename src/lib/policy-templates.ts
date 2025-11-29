export const POLICY_TEMPLATES = {
  refund: (shopName: string) => `Returns and Refunds Policy

Thank you for shopping at ${shopName}.

If you are not entirely satisfied with your purchase, we're here to help.

Returns:
You have 7 calendar days to return an item from the date you received it. To be eligible for a return, your item must be unused and in the same condition that you received it.

Refunds:
Once we receive your item, we will inspect it and notify you that we have received your returned item. We will immediately notify you on the status of your refund after inspecting the item.

Contact Us:
If you have any questions on how to return your item to us, contact us via WhatsApp.`,

  privacy: (shopName: string) => `Privacy Policy

${shopName} operates the https://bizorapro.com/${shopName
    .toLowerCase()
    .replace(/\s/g, "-")} website.

This page is used to inform website visitors regarding our policies with the collection, use, and disclosure of Personal Information if anyone decided to use our Service.

We do not sell, trade, or otherwise transfer to outside parties your Personally Identifiable Information.`,

  terms: (shopName: string) => `Terms of Service

By accessing this website we assume you accept these terms and conditions in full. Do not continue to use ${shopName}'s website if you do not accept all of the terms and conditions stated on this page.

All sales are final unless stated otherwise in our Refund Policy.`,
};
