<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:msxsl="urn:schemas-microsoft-com:xslt" exclude-result-prefixes="msxsl"
    xmlns:s="http://schemas.microsoft.com/sqlserver/2004/07/showplan">
    <xsl:output method="xml" indent="no" omit-xml-declaration="yes" />
  <xsl:include href="qp.xslt" />
  
  <xsl:template match="/">
    <html>
      <head>
        <title>Execution plan</title>
        <link rel="stylesheet" type="text/css" href="qp.css" />
        <script src="jquery.min.js" type="text/javascript"></script>
        <script src="qp.js" type="text/javascript"></script>
        <script type="text/javascript">$(document).ready( function() { QP.drawLines(); });</script>
      </head>
      <body>
        <div>
          <xsl:apply-templates select="s:ShowPlanXML" />
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
