# easy-tokens
Easily insert pieces of dynamic data into your site from your markup

Madlantern's Easy Tokens - A way to easily insert pieces of dynamic data into your site from the markup

Created By: Melanie Wilson - www.madlantern.com - github.com/madlantern/easy-tokens

Published: 2019-07

Description: This plugin takes data from a source you provide and inserts that data into your site, in three different ways. You can have it build an auto-generated table or list of the whole data set, or you can insert values from the dataset wherever you like in your site. This is useful for when you have a list of items (prices, products, interest rates) that have data that is periodically updated. Instead of having to update this information across potentially hundreds of places on your site, it would be easier to update the values in one spot (the data source) and have the values wherever they are used across the whole site. This plugin also caches the dataset in local storage, allows you to set how many days the cache should be stored before it should be refreshed from the data source, and control a few other things, right from the markup—no mods to the script needed.

Before you use this plugin: I am sharing this plugin with the public, free of charge, without any guarantees that it will work on any specific site, and without any guarantee of future versions. If you choose to use this plugin, you agree to use it at your own risk and without any guaranteed support from me.

How to install:

1.	Copy the madln-easy-tokens folder and its contents to a place on your site
2.	From your template file, or on each markup (html, php, etc) page where you want to use this plugin, in the header, add a script reference to the easyTokens-dist.js javascript file which is site-root relative. (That means if the plugin files are stored at mysite.com/scripts/madln-easy-tokens/ then your script reference should look like this: <script type="text/javascript" async="async" defer="defer" src="/scripts/madln-easy-tokens/easyTokens-dist.js"></script>)
3.	Get the URL for your JSON data source (example, /datasources/myProducts.json)
4.	At the top of the body on the page(s) where you want to use your data source, add a hidden input configured in this way: <input type="hidden" value="/datasources/myProducts.json" name="products" data-madln-token-rule /> (replace example value with your data source url, and example name with something that is unique and makes sense to you)

How to use:

•	JSON: Simpler data sources are best. Please look at the example one included in the package. One level deep is best or things begin to look weird on page. For use with tables, best if json first level items all have the same number of children items.
•	Generate a table from the data: Where you want the table to appear in the body, add <table class="madln-easyTokens"></table>
•	Generate a list from the data: Where you want the list to appear in the body, add <ul class="madln-easyTokens"></ul>
•	Insert a value from the data: Where you want a value from the data to appear on a page, insert a span, similar to the following: <span class="madln-easyTokens" data-madln-token-find="entryID.field"></span> -- The first string of characters in the "data-madln-token-find" attribute (entryID in example above) identifies the product in the first level of the data. The second string (field in the example above) identifies which value you want to get, which is set in the second level of the json for the item you selected. Be familiar with your dataset and how things are named. In the example data source, to get the price of the yellow pencils, here is how you’d reference it: <span class="madln-easyTokens" data-madln-token-find="sku5890.price"></span>

Options:

•	Control length of local data caching. On the hidden input add the attribute data-madln-token-refresh-days="" . Any number value will be accepted, and represent a number of days. You can add decimal numbers for less than a day. 0 is off. If you don’t include the attribute, the attribute is blank, or the attribute value isn’t valid, data will be cached for 1 day.
•	Table Styling – I have included some minimal styling, in case it is needed. On the table tag, add this attribute:  data-filter-style="" . Acceptable values are madln-showBorders (to show the table and cell borders) and madln-staggerColors (to show alternating shades of gray on the rows).

Notes:

•	This plugin uses jQuery. It will add and initialize jquery if it finds that it needs to, so if you don’t already have jquery installed or add a reference to jquery anywhere in your scripts or markup.
•	This plugin uses local storage. Local storage is like a cookie, but is its own separate storage area. It stores two variables, a cached version of the info from the data source and a serialized version of the date that the cookie was written.
•	This plugin requires you provide it with a JSON data source. JSON is a way to format data so that it is easily consumed by javascript. You’ll need to store this data source on your own server or have access to the web based tool which generates the data source. You will likely want to host this data source on the same domain where you are using this script to avoid XSS (cross site script) blocking and subsequent errors.
•	Big data sources. If your data source is extremely long (I’d say maybe more than a couple thousand lines), you may run into issues using this plugin, as local storage has a cap on how much data it can store.

Troubleshooting:

•	"unavailable" is displayed where value is expected. This likely means your reference in the data-madln-token-find attribute is not correct. Please doublecheck that those two values match the two values in your data source.
•	 Tokens don’t resolve and/or tables don’t build. Check the javasccript console in the developer tools of your browser. If you see an error referencing the plugin script, that may mean the reference is written incorrectly or the files are missing. Check the reference to the script file in your markup. Also, don’t change the names of the script files! If your site uses a javascript combiner, that could also be the issue.
•	Tokens don’t resolve and/or tables don’t build.  If you’re sure your plugin script is being referenced correctly, check the javascript console for an error from the Easy Tokens script. If it says your data failed to load, check that the data source is in the correct spot and that your reference to it is written correctly in the hidden input.
•	Tokens don’t resolve and/or tables don’t build. If above two scenarios are not the case, check to see if you get any cross site scripting warnings or errors. If your datasource is not on the same site as your script and pages, you will likely encounter blocking of the data source. There are ways to resolve this, but it will take some research and fiddling on your part.
