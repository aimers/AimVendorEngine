import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Enumeration;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
  
@WebServlet("/FileUploadServlet")
@MultipartConfig(fileSizeThreshold=1024*1024*10,    // 10 MB 
                 maxFileSize=1024*1024*10,          // 10 MB
                 maxRequestSize=1024*1024*10)      // 10 MB
public class FileUploadServlet extends HttpServlet {
  
    private static final long serialVersionUID = 205242440643911308L;
     
    /**
     * Directory where uploaded files will be saved, its relative to
     * the web application directory.
     */
    private static final String UPLOAD_DIR = "uploads";
      
    protected void doPost(HttpServletRequest request,
            HttpServletResponse response) throws ServletException, IOException {
    	
    	PrintWriter dataResponse = response.getWriter();
		response.setContentType("text/plain");
		
        // gets absolute path of the web application
        String applicationPath = request.getServletContext().getRealPath("");
        // constructs path of the directory to save uploaded file
        ////home/saath/public_html/bookingdemodocs
        String uploadFilePath = "/Users";//"/home/saath/jvm/apache-tomcat-7.0.57/domains/bookingdemo.aimersinfosoft.com/bookingdemodocs";//"/home/saath/public_html/bookingdemodocs";
        //"/Users/i039198/Documents/Projects/BOOKING/UPLOAD";
        //File.createTempFile("upload-", ".bin");;//applicationPath + File.separator + UPLOAD_DIR;
        // creates the save directory if it does not exists
        Enumeration pnames = request.getParameterNames();
        while(pnames.hasMoreElements()){
    		String paraName = pnames.nextElement().toString();
    		System.out.println(" Para Name : "+paraName);
    		System.out.println(" Para Value : "+request.getParameter(paraName));
    		if(paraName.equals("USRID")){
    			//rootLicKey = request.getParameter(paraName);
    			uploadFilePath =uploadFilePath+"/"+request.getParameter(paraName);
    		}
    	}
        
        File fileSaveDir = new File(uploadFilePath);
        if (!fileSaveDir.exists()) {
            fileSaveDir.mkdirs();
        }
        
        System.out.println("Upload File Directory="+fileSaveDir.getAbsolutePath());
         
        String fileName = null;
        //Get all the parts from request and write it to the file on server
        for (Part part : request.getParts()) {
            fileName = getFileName(part);
            part.write(uploadFilePath + File.separator + fileName);
        }
        
       // request.setAttribute("message", fileName + " File uploaded successfully!");
        dataResponse.print("{ \"fileName\"=\""+ fileName + "\", \"relativePath\"= \""+fileSaveDir.getAbsolutePath()+"\" }");
//        getServletContext().getRequestDispatcher("/response.jsp").forward(
//                request, response);
    }
  
    /**
     * Utility method to get file name from HTTP header content-disposition
     */
    private String getFileName(Part part) {
        String contentDisp = part.getHeader("content-disposition");
        System.out.println("content-disposition header= "+contentDisp);
        String[] tokens = contentDisp.split(";");
        for (String token : tokens) {
            if (token.trim().startsWith("filename")) {
                return token.substring(token.indexOf("=") + 2, token.length()-1);
            }
        }
        return "";
    }
}