const config = require('../config.json')

const MongoClient = require('mongodb').MongoClient
const mws = require('amazon-mws')(config.ACCESS_KEY, config.SECRET_KEY)

const INVENTORY_REPORT = '_GET_AFN_INVENTORY_DATA_BY_COUNTRY_'
const SHIPMENTS_REPORT = '_GET_AMAZON_FULFILLED_SHIPMENTS_DATA_'
const ORDERS_REPORT = '_GET_FLAT_FILE_ALL_ORDERS_DATA_BY_ORDER_DATE_'
const RESERVED_REPORT = '_GET_RESERVED_INVENTORY_DATA_'

async function recordAllReports() {
   const client = await MongoClient.connect(MONGODB_URI)
   const db = client.db(config.MONGODB_DATABASE)

   const inventory = await getInventoryReport()
   db.collection('amazon_inventory').save(inventory)

   const shipments = await getShipmentsReport()
   db.collection('amazon_shipments').save(shipments)

   const orders = await getOrdersReport()
   db.collection('amazon_orders').save(orders)

   const reserved = await getReservedReport()
   db.collection('amazon_reserved').save(reserved)

   client.close()
}

function getInventoryReport() {
   return getReport(INVENTORY_REPORT)
}

function getShipmentsReport() {
   return getReport(SHIPMENTS_REPORT)
}

function getOrdersReport() {
   return getReport(ORDERS_REPORT)
}

function getReservedReport() {
   return getReport(RESERVED_REPORT)
}

/**
 * Takes a report type string, grabs a list of reports with that type and grabs
 * all report items from the most recent one.
 *
 * If there are no reports, we consider this an error.
 */
async function getReport(reportType) {
   const listConfig = getReportListConfig(reportType)
   const res = await mws.reports.search(listConfig)

   if (res.ReportInfo.length === 0) {
      throw new Error(`No ${reportType} reports`)
   }

   const report = res.ReportInfo.shift()
   const reportConfig = getReportConfig(report.ReportId)

   const items = await mws.reports.search(reportConfig)
   report.items = items
   return report
}

/**
 * Configuration for getting a list of Amazon MWS Reports.
 */
function getReportListConfig(reportType) {
   return {
        Version: '2009-01-01',
        Action: 'GetReportList',
        SellerId: SELLERID,
        'ReportTypeList.Type.1': reportType
   }
}

/**
 * Configuration for getting a single Amazon MWS Report.
 */
function getReportConfig(reportId) {
   return {
        Version: '2009-01-01',
        Action: 'GetReport',
        SellerId: SELLERID,
        ReportId: reportId
   }
}

recordAllReports()
