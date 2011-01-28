<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:msxsl="urn:schemas-microsoft-com:xslt" exclude-result-prefixes="msxsl"
    xmlns:s="http://schemas.microsoft.com/sqlserver/2004/07/showplan">
    <xsl:output method="xml" indent="no" omit-xml-declaration="yes" />

  <xsl:include href="qp.xslt" />
  
  <!-- Default template -->
  <xsl:template match="/">
    <html>
      <head>
        <title>Execution plan</title>
        <script src="jquery.min.js" type="text/javascript"></script>
        <script src="qp.js" type="text/javascript"></script>
        <link rel="stylesheet" type="text/css" href="qp.css" />
        <script type="text/javascript">
          $(document).ready( function() { qp_drawLines($("#qp-canvas"), $("#qp-root")); } );
        </script>
        <style type="text/css">
          canvas
          {
            position: absolute;
          }
          #qp-root
          {
            position: absolute;
            z-index: 1;
          }
        </style>
      </head>
      <body>
        <ul id="qp-root">
          <xsl:apply-templates select="s:ShowPlanXML/s:BatchSequence/s:Batch/s:Statements/s:StmtSimple" />
        </ul>
        <canvas id="qp-canvas"></canvas>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
