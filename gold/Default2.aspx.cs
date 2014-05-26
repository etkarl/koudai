using System;
using System.Collections.Generic;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
public partial class Default2 : System.Web.UI.Page
{
    string a = "a";
    protected void Page_Load(object sender, EventArgs e)
    {
        if (Request.Cookies["KlpmeCustomerAplus"] != null)
        {
            string str = Request.Cookies["KlpmeCustomerAplus"].Value;
            
            Request.Cookies["userName"].Value = "test";

            Response.Write(str == "undefined");
        }
        Response.Write(getResult());
    }
    string getResult()
    {
        return a;
    }
}