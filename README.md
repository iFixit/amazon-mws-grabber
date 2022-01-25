# Amazon Reports Grabber

DEPRECATED in favor of https://github.com/iFixit/amazon-mws-analytics

This is used to grab the most recent Amazon MWS reports for inventory,
shipments, orders, and reserved products.

### Config

Configuration is handled through environment variables. They expected
environment variables are:

`AWS_ACCESS_KEY`: Your AWS access key that's used to authenticate with Amazon MWS.

`MWS_SECRET_KEY`: The secret key specified by Amazon MWS.

`MWS_SELLERID`: The sellerid used when authenticating with Amazon MWS.

`MONGODB_URI`: The connection string to connect to MongoDB.

`MONGODB_DATABASE`: The name of the database to place documents in.
