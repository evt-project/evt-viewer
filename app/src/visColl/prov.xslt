<?xml version="1.0" encoding="ISO-8859-1"?>    
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">    
<xsl:output method="xml" media-type="text" version="1.0" encoding="iso-8859-1" indent="yes"/>
 
<xsl:template match="/"> 
       <xmlRidotto>
         <xsl:apply-templates select="//appunto" />
       </xmlRidotto>
</xsl:template>
 
<xsl:template match="//appunto">    
<appunto>
<autore>
<xsl:value-of select="autore"></xsl:value-of>
</autore>
<titolo>
<xsl:value-of select="titolo"></xsl:value-of>
</titolo>
<descrizione>
<xsl:value-of select="descrizione"></xsl:value-of>
</descrizione>
<link>
<xsl:value-of select="link"></xsl:value-of>
</link>
<creato>
<xsl:value-of select="creato"></xsl:value-of>
</creato>
<pubblicato>
<xsl:value-of select="pubblicato"></xsl:value-of>
</pubblicato>
</appunto>
</xsl:template>
 
</xsl:stylesheet>